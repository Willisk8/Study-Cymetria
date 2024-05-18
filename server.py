from flask import Flask, request, redirect, render_template, jsonify
import pymysql

app = Flask(__name__, template_folder="frontend/templates", static_folder="frontend", static_url_path="")

# Configuración de la conexión a la base de datos
db_connection = pymysql.connect(
    host="database-cym-study.c58g2se04jo3.us-east-2.rds.amazonaws.com",
    user="wrobles",
    password="M1n4t4*12",
    database="Study_Cym_Gr8",
    cursorclass=pymysql.cursors.DictCursor  # Esto garantiza que los resultados se devuelvan como diccionarios
)

# Ruta de la página de inicio
@app.route('/')
def index():
    return render_template('Index.html')


@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    try:
        with db_connection.cursor() as cursor:
            cursor.execute("SELECT * FROM Usuarios WHERE email = %s AND contraseña = %s", (username, password))
            user = cursor.fetchone()  # Leer el primer resultado

            if user:
                return 'OK', 200
            else:
                return 'Credenciales inválidas', 401
    except Exception as e:
        print("Error en la consulta SQL:", e)
        return 'Error de servidor', 500

@app.route('/productos')
def obtener_productos():
    try:
        with db_connection.cursor() as cursor:
            # Consulta SQL para obtener los productos con sus categorías
            sql = "SELECT p.nombre, p.descripcion, p.precio, p.stock, c.nombre AS categoria FROM Productos p INNER JOIN Categorias c ON p.categoria_id = c.id"
            cursor.execute(sql)
            productos = cursor.fetchall()

            return jsonify(productos), 200
    except Exception as e:
        print("Error en la consulta SQL:", e)
        return 'Error de servidor', 500
        
        
@app.route('/categorias')
def obtener_categorias():
    try:
        with db_connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM Categorias")
            categorias = cursor.fetchall()
            return jsonify(categorias), 200
    except Exception as e:
        print("Error en la consulta SQL:", e)
        return 'Error de servidor', 500


@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    try:
        data = request.json
        nombre = data['nombre']
        descripcion = data['descripcion']
        precio = data['precio']
        stock = data['stock']
        categoria_id = data['categoria_id']

        with db_connection.cursor() as cursor:
            sql = "INSERT INTO Productos (nombre, descripcion, precio, stock, categoria_id) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (nombre, descripcion, precio, stock, categoria_id))
            db_connection.commit()
            return jsonify({"success": True}), 201
    except Exception as e:
        print("Error en la consulta SQL:", e)
        return jsonify({"success": False, "error": str(e)}), 500

        
if __name__ == '__main__':
    host = "0.0.0.0"
    port = "8080"
    app.run(host, port, debug=True)