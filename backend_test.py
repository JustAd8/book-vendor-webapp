#!/usr/bin/env python3
"""
Backend API Testing for E-Commerce Application
Tests the checkout and orders endpoints as specified in the review request.
"""

import requests
import json
from datetime import datetime
import sys

# Backend URL from environment
BACKEND_URL = "https://webtech-shop.preview.emergentagent.com/api"

def test_checkout_endpoint():
    """Test POST /api/checkout endpoint with different amounts"""
    print("=" * 60)
    print("TESTING POST /api/checkout ENDPOINT")
    print("=" * 60)
    
    test_cases = [
        {"amount": 49.99, "expected_status": "SUCCESS", "description": "Minimum successful amount"},
        {"amount": 50.00, "expected_status": "SUCCESS", "description": "Above minimum amount"},
        {"amount": 30.00, "expected_status": "FAILED", "description": "Below minimum amount"}
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {test_case['description']}")
        print(f"Amount: ${test_case['amount']}")
        
        try:
            # Make POST request to checkout endpoint
            response = requests.post(
                f"{BACKEND_URL}/checkout",
                json={"amount": test_case["amount"]},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
                
                # Verify response structure
                required_fields = ["status", "message", "amount"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"❌ FAILED: Missing required fields: {missing_fields}")
                    results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": f"Missing fields: {missing_fields}"})
                    continue
                
                # Verify status matches expected
                if data["status"] == test_case["expected_status"]:
                    print(f"✅ PASSED: Status is {data['status']} as expected")
                    
                    # For successful payments, verify order_id is present
                    if test_case["expected_status"] == "SUCCESS":
                        if "order_id" in data:
                            print(f"✅ PASSED: Order ID provided: {data['order_id']}")
                            results.append({"test": f"Checkout ${test_case['amount']}", "status": "PASSED", "order_id": data.get("order_id")})
                        else:
                            print(f"❌ FAILED: Missing order_id for successful payment")
                            results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": "Missing order_id"})
                    else:
                        results.append({"test": f"Checkout ${test_case['amount']}", "status": "PASSED"})
                else:
                    print(f"❌ FAILED: Expected status {test_case['expected_status']}, got {data['status']}")
                    results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": f"Wrong status: {data['status']}"})
                    
            else:
                print(f"❌ FAILED: HTTP {response.status_code}")
                print(f"Response: {response.text}")
                results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": f"HTTP {response.status_code}"})
                
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Request error - {str(e)}")
            results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": f"Request error: {str(e)}"})
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            results.append({"test": f"Checkout ${test_case['amount']}", "status": "FAILED", "reason": f"Unexpected error: {str(e)}"})
    
    return results

def test_orders_endpoint():
    """Test GET /api/orders endpoint"""
    print("\n" + "=" * 60)
    print("TESTING GET /api/orders ENDPOINT")
    print("=" * 60)
    
    try:
        # Make GET request to orders endpoint
        response = requests.get(
            f"{BACKEND_URL}/orders",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"Number of orders retrieved: {len(orders)}")
            
            if len(orders) > 0:
                print("\nOrder Structure Verification:")
                first_order = orders[0]
                required_fields = ["id", "product", "amount", "status", "date"]
                
                print(f"Sample order: {json.dumps(first_order, indent=2)}")
                
                missing_fields = [field for field in required_fields if field not in first_order]
                
                if missing_fields:
                    print(f"❌ FAILED: Missing required fields in order: {missing_fields}")
                    return {"test": "Get Orders", "status": "FAILED", "reason": f"Missing fields: {missing_fields}"}
                else:
                    print(f"✅ PASSED: All required fields present: {required_fields}")
                
                # Verify orders from checkout tests are present
                print(f"\nVerifying orders from checkout tests:")
                success_orders = [order for order in orders if order["status"] == "SUCCESS"]
                failed_orders = [order for order in orders if order["status"] == "FAILED"]
                
                print(f"SUCCESS orders: {len(success_orders)}")
                print(f"FAILED orders: {len(failed_orders)}")
                
                # Check for recent orders (from our tests)
                recent_orders = []
                current_time = datetime.now()
                
                for order in orders:
                    try:
                        # Parse the date string
                        order_date = datetime.fromisoformat(order["date"].replace("Z", "+00:00"))
                        time_diff = (current_time - order_date.replace(tzinfo=None)).total_seconds()
                        
                        # Consider orders from last 5 minutes as recent (from our tests)
                        if time_diff < 300:  # 5 minutes
                            recent_orders.append(order)
                    except Exception as e:
                        print(f"Warning: Could not parse date for order {order.get('id', 'unknown')}: {e}")
                
                print(f"Recent orders (last 5 minutes): {len(recent_orders)}")
                
                if len(recent_orders) >= 3:  # We made 3 checkout requests
                    print(f"✅ PASSED: Found {len(recent_orders)} recent orders, indicating checkout tests were saved")
                    return {"test": "Get Orders", "status": "PASSED", "orders_count": len(orders), "recent_orders": len(recent_orders)}
                else:
                    print(f"⚠️  WARNING: Only found {len(recent_orders)} recent orders, expected at least 3 from checkout tests")
                    return {"test": "Get Orders", "status": "PARTIAL", "orders_count": len(orders), "recent_orders": len(recent_orders)}
            else:
                print("⚠️  WARNING: No orders found in database")
                return {"test": "Get Orders", "status": "PARTIAL", "reason": "No orders found"}
                
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return {"test": "Get Orders", "status": "FAILED", "reason": f"HTTP {response.status_code}"}
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAILED: Request error - {str(e)}")
        return {"test": "Get Orders", "status": "FAILED", "reason": f"Request error: {str(e)}"}
    except Exception as e:
        print(f"❌ FAILED: Unexpected error - {str(e)}")
        return {"test": "Get Orders", "status": "FAILED", "reason": f"Unexpected error: {str(e)}"}

def main():
    """Run all backend tests"""
    print("BACKEND API TESTING STARTED")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    # Test checkout endpoint first
    checkout_results = test_checkout_endpoint()
    
    # Test orders endpoint
    orders_result = test_orders_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    all_results = checkout_results + [orders_result]
    
    passed_tests = [r for r in all_results if r["status"] == "PASSED"]
    failed_tests = [r for r in all_results if r["status"] == "FAILED"]
    partial_tests = [r for r in all_results if r["status"] == "PARTIAL"]
    
    print(f"✅ PASSED: {len(passed_tests)} tests")
    print(f"❌ FAILED: {len(failed_tests)} tests")
    print(f"⚠️  PARTIAL: {len(partial_tests)} tests")
    
    if failed_tests:
        print("\nFAILED TESTS:")
        for test in failed_tests:
            print(f"  - {test['test']}: {test['reason']}")
    
    if partial_tests:
        print("\nPARTIAL TESTS:")
        for test in partial_tests:
            print(f"  - {test['test']}: {test.get('reason', 'Partial success')}")
    
    # Return exit code
    if failed_tests:
        print(f"\n❌ TESTING COMPLETED WITH {len(failed_tests)} FAILURES")
        return 1
    elif partial_tests:
        print(f"\n⚠️  TESTING COMPLETED WITH {len(partial_tests)} WARNINGS")
        return 0
    else:
        print(f"\n✅ ALL TESTS PASSED SUCCESSFULLY")
        return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)