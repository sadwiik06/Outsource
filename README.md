OutSource is a powerful full stack web application 


****Important Instruction**: Page may open but Backend dependent operations(signup,register,create task etc) may or may not work when you are testing this, cause render(the place I deployed this project) shuts the backend service within just 15min of inactivity, I have to restart every 15min manually which is hard.. that's the point of making the video even service is stopped video will act as reference)**

Here is the complete demo video: https://drive.google.com/file/d/1SnW8NwUx6HsZx9niD_Y1PiizZtQ543IB/view?usp=sharing

This is demo website: https://outsource-frontend-cpw7.onrender.com/



**Key features include:**

**For clients**

1. Clients can post what they need done how much they are willing to pay and when they need it done.

2. The client can choose a freelancer based on how they have done their jobs before.

3. The system using AI will make a plan for getting the work done in the form of milestones(I made sure this feature work but as per the name I still didn't implemented it using AIML, once I learn AIML I will update this project again for it)

4. Clients can look at the work that has been done give their thoughts on it and pay the freelancer

**For freelancers**

1. Freelancers can see what work they have to do and how money they have made.

2. They can send their work to the client using a website link.

3. They can check how well they are doing their jobs and if they are getting things done on time.

**For administrators(only me)**

1. Administrators can look at all the clients and freelancers. Stop anyone from using the system if they are not being trustworthy.

2. They can change settings that affect the system and decide what a good performance is.



**The technology used to make OutSource**

1. Frontend: React 19 and Vite

2. Backend: Spring Boot

3. Security: JWT

4. Database: MySQL



**For setup locally:**

1. **Environment Requirements**

Java: JDK 21 (as specified in pom.xml)

Node.js: v18+ (standard for Vite/React 19)

Database: MySQL (Local or cloud)

Tools: Maven (via mvnw), npm


2. **Project Setup
Detailed steps for:**

**Backend:**

Environment Configuration: Create .env in TaskPlatformBackend/

DB_URL: JDBC URL for mysql (eg jdbc:mysql://localhost:3306/skill_market)

DB_USERNAME: Database user (your credentials)

DB_PASSWORD: Database password

CORS_ALLOWED_ORIGINS: Origins to allow (eg http://localhost:5173)

Database Initialization: Ensure the target database exists (the app uses hibernate.ddl-auto=update to create tables you don't have to worry about it:)

Run Application: Execute ./mvnw spring-boot:run from the TaskPlatformBackend/ directory

**Frontend:**

Environment Configuration: Create or update .env in TaskPlatformFrontend/

VITE_API_URL: The full URL to the backend API (eg http://localhost:8080/api)

Install Dependencies: Run npm install from the TaskPlatformFrontend/ directory

Start Dev Server: Run npm run dev to start 

