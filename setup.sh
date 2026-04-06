#!/bin/bash

echo "==== School Management DB Setup ===="

read -p "Enter MySQL username: " USER
read -sp "Enter MySQL password: " PASS
echo ""

echo "Creating schema..."
mysql -u $USER -p$PASS < schema.sql

read -p "Do you want to insert sample data? (y/n): " CHOICE

if [ "$CHOICE" = "y" ] || [ "$CHOICE" = "Y" ]; then
    echo "Inserting sample data..."
    mysql -u $USER -p$PASS < sample_data.sql
    echo "Sample data inserted."
else
    echo "Skipping sample data."
fi

echo "Setup complete!"
