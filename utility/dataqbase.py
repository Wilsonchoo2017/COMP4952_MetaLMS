import sqlite3

conn = sqlite3.connect('LOdatabase.db')

c = conn.cursor()
c.execute('SELECT * FROM Learning_Object')
c.close()