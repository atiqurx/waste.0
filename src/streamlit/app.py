import streamlit as st
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import plotly.express as px

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

# Streamlit app
# st.text("Comparing this period's surplus with the previous month shows a.\n Investigate the factors contributing to this change for better decision-making.")

# Get the last 14 days of data for filtering
last_14_days = datetime.now() - timedelta(days=14)
filtered_total_data = total_daily_surplus[total_daily_surplus.index >= last_14_days]

# Convert the total_daily_surplus Series to a DataFrame
total_daily_surplus_df = filtered_total_data.reset_index()  # Reset index to convert Series to DataFrame
total_daily_surplus_df.columns = ['Date', 'Total Surplus']  # Rename columns

# Create a Plotly bar chart
fig = px.bar(total_daily_surplus_df,  # Pass the DataFrame
             x='Date', 
             y='Total Surplus', 
             title="Historical Surplus Trend",
             labels={'Total Surplus': 'Surplus Amount'},
             height=400)

# Customize layout
max_value = filtered_total_data.max()  # Get the maximum value for y-axis scaling
fig.update_layout(
    yaxis=dict(range=[0, max_value * 1.5]),  # Add space above max value
    xaxis_title='Date',                       # X-axis title
    yaxis_title='Total Surplus Amount',       # Y-axis title
    xaxis_tickangle=-45,                      # Rotate x-axis labels
    plot_bgcolor='rgba(255, 255, 255, 0)',   # Set background color (transparent in this case)
    title_font=dict(size=20),                 # Title font size
    margin=dict(l=40, r=40, t=40, b=40)       # Adjust margins around the chart
)

fig.update_traces(marker_color='#f87315')
# Display the Plotly chart
st.plotly_chart(fig, use_container_width=True)
