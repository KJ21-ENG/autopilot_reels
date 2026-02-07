#!/bin/bash

# Function to create a product and its prices
create_plan() {
    NAME=$1
    MONTHLY_AMOUNT=$2
    YEARLY_AMOUNT=$3

    echo "Creating Product: $NAME"
    
    # Create Product
    # Capture JSON output
    PRODUCT_JSON=$(stripe products create --name "$NAME")
    # Extract ID using grep and cut (assuming JSON format "id": "prod_...")
    PRODUCT_ID=$(echo "$PRODUCT_JSON" | grep '"id":' | head -n 1 | cut -d '"' -f 4)
    echo "  Product ID: $PRODUCT_ID"

    # Create Monthly Price
    MONTHLY_PRICE_JSON=$(stripe prices create \
        --product "$PRODUCT_ID" \
        --unit-amount "$MONTHLY_AMOUNT" \
        --currency usd \
        --recurring.interval month)
    MONTHLY_PRICE_ID=$(echo "$MONTHLY_PRICE_JSON" | grep '"id":' | head -n 1 | cut -d '"' -f 4)
    echo "  Monthly Price ID: $MONTHLY_PRICE_ID ($((MONTHLY_AMOUNT / 100))/mo)"

    # Create Yearly Price
    YEARLY_PRICE_JSON=$(stripe prices create \
        --product "$PRODUCT_ID" \
        --unit-amount "$YEARLY_AMOUNT" \
        --currency usd \
        --recurring.interval year)
    YEARLY_PRICE_ID=$(echo "$YEARLY_PRICE_JSON" | grep '"id":' | head -n 1 | cut -d '"' -f 4)
    echo "  Yearly Price ID: $YEARLY_PRICE_ID ($((YEARLY_AMOUNT / 100))/yr)"
    
    echo "------------------------------------------------"
}

echo "Starting Stripe Plan Creation..."
echo "------------------------------------------------"

# Starter Plan: $19/mo, $180/yr
create_plan "Starter" 1900 18000

# Creator Plan: $39/mo, $348/yr
create_plan "Creator" 3900 34800

# Pro Plan: $79/mo, $708/yr
create_plan "Pro" 7900 70800

echo "Done! Save these IDs for your application configuration."
