import sqlite3

def insert( sql ):
    conn = sqlite3.connect('agc.db')
    conn.execute( sql)
    conn.commit()
    conn.close()

def insert_values( sql, values ):
    conn = sqlite3.connect('agc.db')
    conn.execute( sql, values)
    conn.commit()
    conn.close()

def select( sql, func ):
    conn = sqlite3.connect('agc.db')
    cursor = conn.execute(sql)
    obj = None
    for row in cursor:
        obj=func(row)
    conn.close()
    return obj
