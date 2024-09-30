import sqlite3

def init_db():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Create user table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')

        # Create tag table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tag (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                color TEXT NOT NULL
            )
        ''')

        # Create transactions table with date column
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                tag_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY (tag_id) REFERENCES tag (id),
                FOREIGN KEY (user_id) REFERENCES user (id)
            )
        ''')

        # Check if the tag table is empty
        cursor.execute('SELECT COUNT(*) FROM tag')
        if cursor.fetchone()[0] == 0:
            cursor.execute('''
                INSERT INTO tag (name, color) VALUES 
                    ('Food', '#FFB3BA'),
                    ('Transport', '#FFDFBA'),
                    ('Shopping', '#FFFFBA'),
                    ('Entertainment', '#BAFFC9'),
                    ('Health', '#BAE1FF'),
                    ('Bills', '#D3D3D3'),
                    ('Others', '#E6E6FA')
            ''')

        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    init_db()