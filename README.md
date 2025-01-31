# Car-Buddy

## 📌 Overview
This Car Management System allows users to sign up, log in, add, view, search, update, and delete cars. Each car entry includes a title, description, tags, and up to 10 images.

## 🛠 Tech Stack
- **Frontend:** React.js
- **Backend:** Supabase (Auth, Database, and Edge Functions)
- **API Documentation:** Postman
- **Deployment:** Supabase Edge Functions, Vercel

## 🚀 Functional Requirements
### 1️⃣ User Authentication
- ✅ **Sign Up:** Users can create an account.
- ✅ **Login:** Users can log in and maintain authentication.

### 2️⃣ Car Management
- 🚗 **Add a Car:** Users can add a car with a title, description, tags, and up to 10 images.
- 📋 **View Car List:** Users can see a list of all cars they have added.
- 🔍 **Search Cars:** Users can search cars by title, description, or tags.
- 📝 **View Car Details:** Users can click on a car to see its details.
- ✏️ **Update Car Details:** Users can edit a car’s title, description, tags, and images.
- ❌ **Delete a Car:** Users can remove a car from the system.

## 🏗 Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/car-buddy.git
   cd car-buddy
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env` file** in the root directory and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Start the development server:**
   ```sh
   npm start
   ```

## 📡 API Endpoints
### 🔑 Authentication
- **`POST /api/users`** - Register a new user.
- **`POST /api/auth/login`** - Log in an existing user.

### 🚘 Cars
- **`POST /api/cars`** - Add a new car.
- **`GET /api/cars`** - Get a list of all cars.
- **`GET /api/cars/:id`** - Get details of a specific car.
- **`PUT /api/cars/:id`** - Update car details.
- **`DELETE /api/cars/:id`** - Delete a car.

## 📤 Deployment
- **Frontend:** Deploy the React app using [Vercel](https://vercel.com/).
- **Backend:** Deploy Supabase Edge Functions through the [Supabase dashboard](https://supabase.com/).

## 🤝 Contributing
1. **Fork the repository.**
2. **Create a new branch** (`feature/your-feature`).
3. **Commit your changes** (`git commit -m 'Add new feature'`).
4. **Push to the branch** (`git push origin feature/your-feature`).
5. **Open a Pull Request.**

## 📜 License
This project is licensed under the **MIT License**.

