# Student Finance Helper

A full-stack web application for students to track budgets, expenses, and savings goals.

## 🚀 Overview

Student Finance Helper enables users to securely log in, manage their personal finances, track spending, set budgets, and visualize progress toward savings goals—all in one dashboard. Built with Express.js (backend), EJS views, and MongoDB (database), this project demonstrates a robust, secure CRUD application designed for easy use and cloud deployment.

## 🛠️ Tech Stack

- **Back-End**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (session-based, user login/register with `passport-local-mongoose`)
- **Templates**: EJS for server-rendered views
- **Frontend**: Bootstrap 5 for styling
- **API**: RESTful endpoints for CRUD operations

## 💡 Main Features

- **User Authentication**: Register / Login / Logout (session-based)
- **Budget CRUD**: Set, update, and delete budgets for categories (rent, groceries, transport, etc.)
- **Expense CRUD**: Log, edit, or remove expenses with categorization
- **Savings Goals**: Create goals, track progress, update saved amounts
- **Responsive UI**: Bootstrap-based design with FontAwesome icons
- **User-Specific Data**: All data is tied to the logged-in user

## 📁 Folder Structure

```
/client                # Angular frontend (optional)
  /src/app            # Angular modules
/server               # Express.js backend
  /config             # Passport, DB, app configuration
    /app.js           # Main Express app setup
    /db.js            # MongoDB connection
    /passport.js      # Passport strategies
  /model              # Mongoose models
    /user.js          # User schema with passport-local-mongoose
    /budget.js        # Budget schema
    /expense.js       # Expense schema
    /goal.js          # Goal schema
  /routes             # API routes
    /index.js         # Auth routes (register/login/logout)
    /budget.js        # Budget CRUD routes
    /expense.js       # Expense CRUD routes
    /goal.js          # Goal CRUD routes
    /book.js          # Book CRUD (sample template)
  /views              # EJS templates
    /Budgets/         # Budget views (list, add, edit)
    /Expenses/        # Expense views (list, add, edit)
    /Goals/           # Goal views (list, add, edit)
    /auth/            # Login/Register views
    /partials/        # Header, footer, navbar
/public               # Static assets (CSS, JS, images)
  /Content/           # App styles
/server.js            # Main entry file
.env                  # Environment variables (MongoDB URI, PORT, SESSION_SECRET)
.gitignore            # Exclude node_modules, .env, etc.
package.json          # Dependencies and scripts
```

## ⚙️ API Endpoints

### Authentication
- `GET /login` — Display login page
- `POST /login` — Authenticate user
- `GET /register` — Display register page
- `POST /register` — Create new user
- `GET /logout` — Logout user

### Budgets
- `GET /budgets` — List all budgets for logged-in user
- `GET /budgets/add` — Display add budget form
- `POST /budgets/add` — Create new budget
- `GET /budgets/edit/:id` — Display edit budget form
- `POST /budgets/edit/:id` — Update budget
- `GET /budgets/delete/:id` — Delete budget

### Expenses
- `GET /expenses` — List all expenses for logged-in user
- `GET /expenses/add` — Display add expense form
- `POST /expenses/add` — Create new expense
- `GET /expenses/edit/:id` — Display edit expense form
- `POST /expenses/edit/:id` — Update expense
- `GET /expenses/delete/:id` — Delete expense

### Goals
- `GET /goals` — List all goals for logged-in user
- `GET /goals/add` — Display add goal form
- `POST /goals/add` — Create new goal
- `GET /goals/edit/:id` — Display edit goal form
- `POST /goals/edit/:id` — Update goal (add saved amount, mark completed)
- `GET /goals/delete/:id` — Delete goal

## 🏗️ User Flow

1. **Register** — Create an account with username, email, and password
2. **Login** — Authenticate and access the dashboard
3. **Set Budgets** — Create budgets for expense categories (rent, groceries, etc.)
4. **Log Expenses** — Track spending by category with optional receipt URLs
5. **Create Savings Goals** — Define target amounts and deadlines
6. **Update Goals** — Add progress toward goals
7. **View Data** — Navigate between budgets, expenses, and goals via the navbar
8. **Logout** — End your session securely

## 🧑‍💻 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup (Windows PowerShell)

1. **Clone or navigate to the project folder:**
   ```powershell
   cd c:\Users\AARRAV\WebscriptProgramming\Assignment-3
   ```

2. **Create `.env` file** (if not already created):
   ```powershell
   @"
MONGODB_URI=mongodb+srv://aarravbala_admin:finance_admin@studentfinancehelper.norpjd6.mongodb.net/studentfinancedb?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_secret_key_change_this_in_production
   "@ | Out-File -Encoding UTF8 .env
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Start the server:**
   ```powershell
   npm start
   ```
   Or with auto-reload (requires `nodemon`):
   ```powershell
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup (Angular - Optional)

1. **Navigate to the client folder:**
   ```powershell
   cd c:\Users\AARRAV\WebscriptProgramming\Assignment-3\client
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the dev server:**
   ```powershell
   npm start
   ```

   The frontend will run on `http://localhost:4200`

## 📝 Environment Variables

Create a `.env` file in the root directory with the following:

```
MONGODB_URI=your_mongodb_atlas_uri
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_secret_key
```

**Important**: Never commit `.env` to version control. Add it to `.gitignore`.

## 🔐 Security Notes

- Passwords are hashed using `passport-local-mongoose`
- Sessions are stored in-memory (use session store middleware for production)
- CORS is enabled for API flexibility
- All financial data is private and tied to the authenticated user
- Environment variables keep secrets secure

## ✨ Key Features by Component

### User Model
- Username (unique)
- Email (unique)
- Password (hashed)
- Display Name
- Created/Updated timestamps
- Passport-local-mongoose for authentication

### Budget Model
- Title & Category (rent, groceries, transport, etc.)
- Amount and Period (monthly, weekly, one-time)
- User reference for ownership
- Timestamps

### Expense Model
- Title & Amount
- Category (groceries, transport, entertainment, etc.)
- Date and optional Receipt URL
- User reference for ownership
- Timestamps

### Goal Model
- Title, Target Amount, and Current Amount
- Deadline date (optional)
- Completed status
- User reference for ownership
- Timestamps

## 📊 Example Usage

### Register a New User
1. Navigate to `http://localhost:5000/register`
2. Fill in username, email, password, and display name
3. Click "Register" to create your account

### Add a Budget
1. Login to your account
2. Click "Budgets" in the navbar
3. Click "Add New Budget"
4. Fill in title, category, amount, and period
5. Click "Add Budget"

### Log an Expense
1. Click "Expenses" in the navbar
2. Click "Add New Expense"
3. Fill in title, amount, category, and date
4. Optionally add a receipt URL
5. Click "Add Expense"

### Create a Savings Goal
1. Click "Goals" in the navbar
2. Click "Add New Goal"
3. Fill in goal title, target amount, and optional deadline
4. Click "Create Goal"
5. View progress on the goals list page

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure your MongoDB Atlas cluster is running
- Verify the `MONGODB_URI` in `.env` is correct
- Check firewall/IP whitelist in MongoDB Atlas

### Port Already in Use
- Change the `PORT` in `.env` to an available port (e.g., 5001)
- Or stop the process using port 5000

### Session Not Persisting
- Ensure cookies are enabled in your browser
- Clear browser cache and cookies if needed

## 📚 Template Pattern

This project follows the **book-library template pattern** for consistency:
- **Models**: Mongoose schemas in `/model` folder
- **Routes**: RESTful endpoints in `/routes` folder
- **Views**: EJS templates organized by feature in `/views` folder
- **Auth**: Passport.js with session management in `/config`

## 🚀 Deployment

### Heroku Deployment
1. Install Heroku CLI
2. Create a Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=your_uri`
4. Push to Heroku: `git push heroku main`

### Environment Readiness
- Set `NODE_ENV=production` in deployed environment
- Use a production-grade session store (e.g., MongoDB session store)
- Enable HTTPS for all communications
- Rotate `SESSION_SECRET` regularly

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Passport.js Documentation](https://www.passportjs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0)

## 📝 Notes

- All financial data is private and tied to the logged-in user
- The Angular frontend is optional; the Express backend provides full CRUD functionality
- Use Bootstrap classes for responsive design
- FontAwesome icons are available for UI elements
- This project is designed for educational purposes

## 🤝 Contributing

Feel free to fork, modify, and enhance this project. Suggestions:
- Add charts/analytics using Chart.js
- Implement bill-splitting features
- Add recurring expense reminders
- Create CSV export for expense reports
- Implement multi-currency support

## 📄 License

This project is open-source and available under the MIT License.

---

**Happy Finance Tracking! 💰**
