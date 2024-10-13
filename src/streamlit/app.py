import streamlit as st
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Title of the Streamlit app
st.title("Inventory Management Dashboard")

# Load environment variables from .env file
load_dotenv()

# Fetch user data from MongoDB
def fetch_user_data():
    mongo_api_url = os.getenv("MONGODB_URL")
    
    if mongo_api_url is None:
        st.warning("MONGODB_URL is not set. Please check your .env file.")
        return [], []

    # Connect to the MongoDB database
    try:
        client = MongoClient(mongo_api_url)
        db = client['test']  # Connect to the 'test' database
        collection = db['businesses']  # Access the 'businesses' collection
        predictions = db['predictions']

        predictions_data = list(predictions.find())

        business_data = list(collection.find())  # Fetch all business data
        return business_data, predictions_data
    except Exception as e:
        st.error(f"Error connecting to MongoDB: {e}")
        return [], []

# Fetch user data
business_data, predictions_data = fetch_user_data()

# Define the directory where your CSV files are located
data_directory = './data'  # Replace with your actual directory

# Initialize an empty DataFrame to hold surplus data
all_surplus_data = pd.DataFrame()

# Extract optimalOrder from the first business record (assuming it's there)
if business_data:
    optimal_order = predictions_data[0].get('optimalOrder', {})
else:
    optimal_order = {}

# Convert optimalOrder data to a pandas DataFrame
optimal_order_df = pd.DataFrame(list(optimal_order.items()), columns=['Category', 'Optimal Order'])

# Optimal Order Bar Chart
st.subheader("Optimal Order by Category")
st.bar_chart(optimal_order_df.set_index('Category'))

# Loop through all CSV files in the directory
for filename in os.listdir(data_directory):
    if filename.endswith('.csv'):
        # Read each CSV file
        file_path = os.path.join(data_directory, filename)
        csv_data = pd.read_csv(file_path)

        # Ensure the Date column is in datetime format, if it exists
        if 'Date' in csv_data.columns:
            csv_data['Date'] = pd.to_datetime(csv_data['Date'])

        # Check if Surplus column exists and add it to the overall surplus DataFrame
        if 'Category' in csv_data.columns and 'Surplus' in csv_data.columns:
            all_surplus_data = pd.concat([all_surplus_data, csv_data[['Date', 'Category', 'Surplus']]], ignore_index=True)

# Create a pivot table for daily surplus
pivot_daily_summary = all_surplus_data.pivot_table(index='Date', columns='Category', values='Surplus', aggfunc='sum', fill_value=0)

# Sum the surplus amounts across all categories for each day
total_daily_surplus = pivot_daily_summary.sum(axis=1)

# Get the last 14 days of data for filtering
last_14_days = datetime.now() - timedelta(days=14)
filtered_total_data = total_daily_surplus[total_daily_surplus.index >= last_14_days]

# Convert the total_daily_surplus Series to a DataFrame
total_daily_surplus_df = filtered_total_data.reset_index()  # Reset index to convert Series to DataFrame
total_daily_surplus_df.columns = ['Date', 'Total Surplus']  # Rename columns

# Create a combined Plotly figure with subplots
fig = make_subplots(rows=1, cols=2, 
                    subplot_titles=("Total Surplus by Date", "Optimal Order by Category"),
                    horizontal_spacing=0.1)  # Set horizontal spacing

# Add Total Surplus bar chart to the first subplot
fig.add_trace(
    go.Bar(x=total_daily_surplus_df['Date'], 
           y=total_daily_surplus_df['Total Surplus'], 
           name='Total Surplus', 
           marker_color='#f87315'),
    row=1, col=1
)

# Add Optimal Order bar chart to the second subplot
fig.add_trace(
    go.Bar(x=optimal_order_df['Category'], 
           y=optimal_order_df['Optimal Order'], 
           name='Optimal Order', 
           marker_color='#1f77b4'),
    row=1, col=2
)

# Update layout for the combined figure
fig.update_layout(
    title_text="Inventory Management Dashboard",
    height=400,  # Adjust height to fit both charts
    xaxis_title='Date',
    yaxis_title='Amount',
    barmode='group',  # Group bar charts together
    title_font=dict(size=20),
)

# Display the Plotly chart
st.plotly_chart(fig, use_container_width=True)
