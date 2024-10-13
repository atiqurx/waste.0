import streamlit as st
import pandas as pd
# from pymongo import MongoClient
# from dotenv import load_dotenv
import os
import plotly.express as px
from datetime import datetime, timedelta

# Title of the 
st.title("Inventory Management Dashboard")

# Load environment variables from .env file
# load_dotenv()

# Fetch user data from MongoDB
# def fetch_user_data():
#     mongo_api_url = os.getenv("MONGODB_URL")
    
#     if mongo_api_url is None:
#         st.warning("MONGODB_URL is not set. Please check your .env file.")
#         return []

#     # Connect to the MongoDB database
#     try:
#         client = MongoClient(mongo_api_url)
#         db = client['test']  # Connect to the 'test' database
#         collection = db['businesses']  # Access the 'businesses' collection

#         business_data = list(collection.find())  # Fetch all business data
#         return business_data
#     except Exception as e:
#         st.error(f"Error connecting to MongoDB: {e}")
#         return []


# # Fetch user data
# user_data = fetch_user_data()


# Define the directory where your CSV files are located
data_directory = './data'  # Replace with your actual directory

# Initialize an empty DataFrame to hold surplus data
all_surplus_data = pd.DataFrame()

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

# Streamlit app
st.title("Daily Surplus Amount by Category")

# Create a pivot table for daily surplus
pivot_daily_summary = all_surplus_data.pivot_table(index='Date', columns='Category', values='Surplus', aggfunc='sum', fill_value=0)

# Get the last 14 days of data for filtering
last_14_days = datetime.now() - timedelta(days=14)
filtered_data = pivot_daily_summary[pivot_daily_summary.index >= last_14_days]

# Select categories to display
categories = pivot_daily_summary.columns.tolist()  # Use full data categories
selected_categories = st.multiselect("Select Categories", categories, default=categories)  # Allow multiple selections

# Filter the surplus data based on selected categories
if selected_categories:
    filtered_surplus_summary = filtered_data[selected_categories]
else:
    filtered_surplus_summary = filtered_data  # Show all if none selected

# Convert index (dates) to string format for better readability
filtered_surplus_summary.index = filtered_surplus_summary.index.strftime('%d %B')

# Show only the last N rows to avoid clustering (e.g., last 10)
num_rows_to_display = 50
subset_data = filtered_surplus_summary.tail(num_rows_to_display)

# Display the subset of data in a scrollable table
st.dataframe(subset_data, height=300)  # You can adjust the height as needed

# Create a scrollable area chart using Plotly
fig = px.line(pivot_daily_summary, x=pivot_daily_summary.index, y=pivot_daily_summary.columns,
              labels={'value': 'Surplus Amount', 'variable': 'Category'}, title='Daily Surplus Amount by Category')

# Update the layout for better readability
fig.update_layout(
    xaxis_title='Date',
    yaxis_title='Surplus Amount',
    yaxis=dict(range=[0, pivot_daily_summary.max().max() + 30]),  # Set y-axis to start from 0
    xaxis=dict(
        range=[pivot_daily_summary.index.min(), pivot_daily_summary.index.max()],  # Set the x-axis range to include all dates
    ),
    xaxis_tickangle=-45,
    hovermode="x unified"  # Optional: show a unified hover effect
)

# Display the Plotly chart with horizontal scrolling
st.plotly_chart(fig, use_container_width=True)
