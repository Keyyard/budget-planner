# Budget Planner

## Overview

**Budget Planner** is a full-stack web application designed to help users manage their finances efficiently. It allows users to log expenses and income, categorize them with customizable tags, and visualize their spending habits through interactive statistics. The app includes user authentication for secure personal data storage and features an intuitive interface for tracking financial history, editing records, and analyzing spending patterns.

## Features

- **User Authentication:** Secure login system to protect personal financial data.
- **Expense and Income Logging:** Easy-to-use interface for recording financial transactions.
- **Customizable Tags:** Flexible categorization system for better organization of expenses and income.
- **Interactive Visualizations:** Dynamic charts and graphs to illustrate spending patterns.
- **Transaction Management:** Ability to view, edit, and delete financial entries.
- **Budget Analysis:** Insightful breakdowns of spending habits and financial trends.
- **Responsive Design:** Accessible on various devices for on-the-go financial management.

## **Data Model**

### Users Collection

- **_id**: ObjectId, primary key.
- **username**: Unique string, not null.
- **password**: String, not null.

### Tags Collection

- **_id**: ObjectId, primary key.
- **user_id**: ObjectId, references `users(_id)`, not null.
- **name**: Unique string, not null.
- **color**: String representing color in hex format, not null.

### Transactions Collection

- **_id**: ObjectId, primary key.
- **user_id**: ObjectId, references `users(_id)`, not null.
- **tag_id**: ObjectId, references `tags(_id)` .
- **amount**: Number, not null.

# Pages

## Home Page

### Components:

1. **Budget Input**
    - Amount input and tag selection.
2. **Recent Transactions**
    - Displays a few recent transactions.
3. **Simple Charts**
    - Total Income in selected range.
    - Total Spend in selected range.

## **Transactions Page**

### Components:

1. **Transaction History**
    - Load more transactions on scroll.
    - All transactions can be edited (both amount and tag) and removed.

## **Analysis Page**

### Components

1. **Bar Charts**
    - Current balance.
    - Total Income in selected range.
    - Total Spend in selected range.
    - Total Spend of each tag in selected range.
2. **Pie Chart**
    - Distribution of spending by tags.

## Settings Page

### Components:

Welcome Message

- Welcome back, {user}.
1. **Tags Management**
    - **Tag List:** Displays existing tags with options to edit or delete.
    - **Edit Tag:** Allows editing of tag name and color.
    - **Add Tag:** Provides an interface to create a new tag with name and color.
2. **Range Options**
    - **Start of Month:** Allows users to set the day of the month when they start receiving income for tracking purposes.
3. **Themes**
    - **Light Theme:** Day mode.
    - **Dark Theme:** Night mode.
4. **Logout**
    - Provides an option to log out of the application.

## **API Endpoints**

- **POST /login**: Authenticate user.
- **POST /register**: Register a new user.
- **GET /protected**: Returns user.
- **POST /logout**: logout user.
- **POST /refresh**: refresh token
- **POST /delete_user**: delete user
- **GET /tags**: Retrieve all tags for the user.
- **POST /tags**: Create a new tag.
- **PUT /tags/:id**: Update an existing tag.
- **DELETE /tags/:id**: Delete a tag.
- **GET /transactions**: Retrieve all transactions for the user.
- **POST /transactions**: Create a new transaction.
- **PUT /transactions/:id**: Update an existing transaction.
- **DELETE /transactions/:id**: Delete a transaction.

## **Technologies**

- **Frontend**: React, Tailwind CSS
- **Backend**: Flask
- **Database**: SQLite3/ MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js
- **Status**: Toaster