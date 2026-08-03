"""
PROBLEM: Inventory Reconciliation

You work at an e-commerce company. Every night, a script exports two lists:
what the warehouse system thinks is in stock, and what the sales system
thinks was sold that day. You need to reconcile them into a single report.

Each transaction is a dict like this:

    warehouse_records = [
        {"sku": "A100", "location": "WH1", "qty": 50},
        {"sku": "A100", "location": "WH2", "qty": 30},
        {"sku": "B200", "location": "WH1", "qty": 10},
    ]

    sales_records = [
        {"sku": "A100", "qty_sold": 45},
        {"sku": "C300", "qty_sold": 5},   # sold but not in warehouse records at all
    ]

Write a function
`reconcile_inventory(warehouse_records: list[dict], sales_records: list[dict]) -> dict`
that returns:

    1. total_stock_per_sku
         - dict mapping each SKU to its total quantity across all warehouse locations.

    2. remaining_stock_per_sku
         - dict mapping each SKU to (total_stock - qty_sold).
         - If a SKU was never sold, remaining = total stock.
         - If a SKU has no warehouse record, treat total stock as 0.

    3. oversold_skus
         - list of SKUs where qty_sold > total_stock (i.e. remaining stock
           went negative), in the order first encountered in sales_records.

    4. sku_locations
         - dict mapping each SKU to a list of the warehouse locations it's
           stored in (order they first appear).

Example output for the data above:

    {
        "total_stock_per_sku": {"A100": 80, "B200": 10},
        "remaining_stock_per_sku": {"A100": 35, "B200": 10, "C300": -5},
        "oversold_skus": ["C300"],
        "sku_locations": {"A100": ["WH1", "WH2"], "B200": ["WH1"]}
    }

Constraints / notes:
    - Warehouse records may have multiple entries for the same SKU
      (different locations) -- you need to sum them.
    - A SKU might appear in sales_records but never in warehouse_records
      (unexpected sale) -- you still need to include it in
      remaining_stock_per_sku and check it for oversell.
    - Aim for a single pass over each list where possible.

What this tests: merging data from two separate sources, handling missing
keys gracefully (no crashes on lookup), and building multiple derived views
from the same underlying data -- a very common "reconcile two systems"
pattern in real backend work.
"""


def reconcile_inventory(warehouse_records: list[dict], sales_records: list[dict]) -> dict:
    # total skus:
    skus = {}
    for entry in warehouse_records:
        if entry["sku"] in skus:
            skus[entry["sku"]] += entry["qty"]
        else:
            skus[entry["sku"]] = entry["qty"]
    
    # remaining stock per sku and oversold skus
    remaining_stock = {}
    oversold_skus = []
    for entry in sales_records:
        sku = entry["sku"]
        if sku in remaining_stock:
            remaining_stock[sku] -= entry["qty_sold"]
        elif sku in skus:
            remaining_stock[sku] = skus[sku] - entry["qty_sold"]
        else:
            remaining_stock[sku] = 0 - entry["qty_sold"]
    
        if remaining_stock[sku] < 0 and sku not in oversold_skus:
            oversold_skus.append(sku)
    for sku, total in skus.items():
        if sku not in remaining_stock:
            remaining_stock[sku] = total
            
    # sku locations
    sku_locations = {}
    for entry in warehouse_records:
        sku = entry["sku"]
        location = entry["location"]
        if sku not in sku_locations:
            sku_locations[sku] = []
        if location not in sku_locations[sku]:
            sku_locations[sku].append(location)

    return {
        "total_stock_per_sku": skus,
        "remaining_stock_per_sku": remaining_stock,
        "oversold_skus": oversold_skus,
        "sku_locations": sku_locations,
    }