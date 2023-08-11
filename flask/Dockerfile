# Use an official Python runtime as the parent image
FROM python:3.9-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Flask
RUN pip install flask

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define an environment variable for Flask to run the app
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Run app.py when the container launches
CMD ["python", "app.py"]

