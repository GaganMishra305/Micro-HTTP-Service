
**Assignment: Micro HTTP Service**

**Overview**  
At Eraah, we’re an AI-focused company building solutions like AI agents for NGOs and SaaS platforms. For this internship assignment, you’ll create a full-stack MERN application that fetches student details from a provided API, processes them in a secure backend, and displays them on a React frontend with charts or graphs to visualize the data.

**Tasks**  

1. **Backend Development (Node.js + Express.js + MongoDB)**:  
   ○ Build a RESTful API using Node.js and Express.js that:  
   ■ Fetches student data from the provided API:  
   https://67ebf57baa794fb3222c4652.mockapi.io/eraah/students (GET).  
   ■ Stores the data in a MongoDB database (e.g., a students collection).  
   ■ Processes the data (e.g., sort by name, filter active students, or add a  
   field like last_updated).  
   ■ Exposes an endpoint (e.g., GET /students) to serve the processed data.  
   ○ Secure the /students endpoint (e.g., with JWT or another method of your choice).  

2. **Frontend Development (React)**:  
   ○ Build a React application that:  
   ■ Calls your backend API (e.g., GET /students) with proper authentication.  
   ■ Displays the student data in a table or list (e.g., columns: ID, Name, Age,  
   Course, Active).  
   ■ Processes the data further (e.g., count active students, average age, or  
   group by course).  
   ■ Visualizes the processed data using charts or graphs (e.g., bar chart of  
   students per course, pie chart of active vs. inactive students) with a  
   library like Chart.js or Recharts.  

3. **Bonus (Optional)**:  
   ○ Add a filter on the frontend (e.g., “Show only active students”).  
   ○ Implement a dark theme toggle.  

**Provided Resources**  

● Mock API:  
○ Endpoint: https://67ebf57baa794fb3222c4652.mockapi.io/eraah/students  
○ Method: GET  

**Response:** JSON array of student objects:
