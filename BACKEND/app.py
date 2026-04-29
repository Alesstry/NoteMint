from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import MySQLdb.cursors, re, hashlib
print("flask ejecutado bien")
app = Flask(__name__)

app.secret_key = 'notemint08'

# conexion a mysql esto puedo cambiar si es remota
app.config['MYSQL_HOST'] = 'monorail.proxy.rlwy.net'
app.config['MYSQL_USER'] = 'root' #nombre del user
app.config['MYSQL_PASSWORD'] = 'gSXeqMYcAthrrXFzzVrIpApMrdKRQDOL' #contraseña de user
app.config['MYSQL_DB'] = 'railway' # nombre de la base de datos
app.config['MYSQL_PORT'] = 23423


mysql  = MySQL(app)


# nombre de la base de datos.
#*@app.route('/pruebaDeError/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    #mensaje de error

    #auntenticacion

    if request.method == 'POST' and 'usuario' in request.form and 'email' in request.form:
        usuario = request.form['usuario']
        email = request.form['email']

        #hash = email + app.secret_key
        #hash = hashlib.sha1(hash.encode)

        # talvez tengamos un problema por el hexadigest
        #email = hash.hexdigest()


        # verificar si el usuario existe

        # bloque conexion
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM usuarios WHERE nombre = %s AND email = %s', (usuario, email))
        account = cursor.fetchone()

        #------------------------------------------------------


        # bloque cuenta
        
        #--- sesion iniciada
        if account:
            session['loggedin'] = True
            session['id'] = account['id']
            session['nombre'] = account['nombre']
            return 'Se inicio sesion correctamente'
        else:
            msg = "hubo un problema con el usuario/email"

    msg = 'Error en la conexion'
    return render_template('index.html', msg=msg)



# registro
@app.route('/register', methods=['GET', 'POST'])
def register():

    # Verificacion bloque 1 - registro
    msg = ''
    if request.method == 'POST' and 'usuario' in request.form and 'email' in request.form:
        usuario = request.form['usuario']
        email = request.form['email']


        # bloque registro

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM usuarios WHERE nombre = %s', (usuario,))
        account = cursor.fetchone()

        #bloque si existe una cuanta con los datos devolver un mensaje que ya
        # exista, si no continuar con los valores

        if account:
            msg = 'la cuenta ya existe'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = "correo invalido"
        elif not re.match(r'[A-Za-z0-9]+', usuario):
            msg = 'El usuario solo puede tener caracteres y numeros'
        elif not usuario or not email: 
            msg = 'Rellena el formulario'
        else:
            # ojo aqui se puede agregar el apellido pero tenemos que creear su apartado
            # por el momento solo lo basico
            cursor.execute('INSERT INTO usuarios(nombre, email) VALUES(%s, %s)',(usuario, email,))
            mysql.connection.commit()
            msg = 'Se a registrado tu cuenta'

        #-----------------------

        # se podria agregar constraseña para mas seguridad

    elif request.method == 'POST':
        msg = "Porfavor de rellenar el formulario"


    return render_template('registro.html', msg=msg)