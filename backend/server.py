from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Order Models for E-Commerce
class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product: str = "Advanced Web Tech E-book"
    amount: float
    status: str  # SUCCESS or FAILED
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    amount: float

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# E-Commerce Routes
@api_router.post("/checkout")
async def checkout(checkout_data: CheckoutRequest):
    """
    Simulates payment gateway logic:
    - If amount >= 49.99: SUCCESS
    - If amount < 49.99: FAILED
    - Successful orders are saved to MongoDB
    """
    try:
        amount = checkout_data.amount
        
        # Payment simulation logic
        if amount >= 49.99:
            status = "SUCCESS"
            message = "Payment Successful! Your order has been placed."
            
            # Create and save order to database
            order = Order(amount=amount, status=status)
            order_dict = order.model_dump()
            order_dict['date'] = order_dict['date'].isoformat()
            
            await db.orders.insert_one(order_dict)
            
            return {
                "status": status,
                "message": message,
                "order_id": order.id,
                "amount": amount
            }
        else:
            status = "FAILED"
            message = f"Payment Failed! Minimum amount required is $49.99. You provided ${amount:.2f}."
            
            # Still save failed transaction for records
            order = Order(amount=amount, status=status)
            order_dict = order.model_dump()
            order_dict['date'] = order_dict['date'].isoformat()
            
            await db.orders.insert_one(order_dict)
            
            return {
                "status": status,
                "message": message,
                "amount": amount
            }
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}")
        return {
            "status": "ERROR",
            "message": "An error occurred during checkout. Please try again.",
            "error": str(e)
        }

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    """Retrieve all orders from database"""
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string dates back to datetime objects
    for order in orders:
        if isinstance(order['date'], str):
            order['date'] = datetime.fromisoformat(order['date'])
    
    return orders

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()