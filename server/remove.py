import sqlite3
import sys

def remove( uuid ):
    sqls = [
        f'DELETE FROM comparators WHERE uid ="{uuid}";',
        f'DELETE FROM final_review WHERE uid ="{uuid}";',
        f'DELETE FROM reviews WHERE uid ="{uuid}";',
        f'DELETE FROM systematic_review WHERE uid="{uuid}";',
    ]
    conn = sqlite3.connect('agc.db')
    for sql in sqls:
        conn.execute( sql)
    conn.commit()
    conn.close()

def init():
    sqls = [
    """
    CREATE TABLE reviews (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid TEXT,
	created_at TEXT
);""",
    """
CREATE TABLE comparators (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid TEXT,
	outcome TEXT,
	intervention TEXT,
	comparator TEXT,
	path_files TEXT,
	done INTEGER DEFAULT (0),
	"result" TEXT,
	created_at TEXT
, report_id TEXT);
""","""
CREATE TABLE systematic_review (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid TEXT,
	"path" TEXT,
	I2 TEXT,
	done INTEGER DEFAULT (0),
	"result" TEXT,
	created_at TEXT	
);""", """
CREATE TABLE "final_review" (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uid TEXT,
	response TEXT,
	created_at TEXT
);"""
    ]

    conn = sqlite3.connect('agc.db')
    for sql in sqls:
        conn.execute( sql)
    conn.commit()
    conn.close()

# remove( sys.argv[1] )
init()