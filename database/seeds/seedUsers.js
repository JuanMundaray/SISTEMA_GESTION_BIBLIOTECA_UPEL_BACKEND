require('dotenv').config();
const pool = require('../../config/db');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// Función para hashear contraseñas
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Función para generar cédulas venezolanas
function generarCedulaVenezolana() {
  const numero = faker.number.int({ min: 1000000, max: 30000000 });
  const numeroFormateado = numero.toString().padStart(8, '0');
  const digitos = numeroFormateado.split('').map(Number);
  let suma = 0;
  
  for (let i = 0; i < digitos.length; i++) {
    let multiplicador = (i % 2 === 0) ? 3 : 1;
    suma += digitos[i] * multiplicador;
  }
  
  const verificador = (10 - (suma % 10)) % 10;
  return `${numeroFormateado}`;
}

// Función para generar usernames con reglas
function generarUsernameConReglas(firstName, lastName) {
  const randomNum = faker.number.int({ min: 1, max: 999 });
  const specialChars = ['_', '.', '-'];
  
  // Crear variaciones que cumplen con las reglas
  const variations = [
    `${firstName}${randomNum}`, // John25
    `${firstName}${faker.helpers.arrayElement(specialChars)}${lastName}${randomNum}`, // John_Doe25
    `${firstName.charAt(0)}${lastName}${randomNum}`, // JDoe25
    `${firstName.toLowerCase()}${randomNum}${lastName.toUpperCase().charAt(0)}`, // john25D
    `${randomNum}${firstName}${lastName.charAt(0)}` // 25JohnD
  ];
  
  let username = faker.helpers.arrayElement(variations);
  
  // Asegurar al menos una mayúscula
  if (!/[A-Z]/.test(username)) {
    const randomIndex = faker.number.int({ min: 0, max: username.length - 1 });
    username = username.substring(0, randomIndex) + 
              username.charAt(randomIndex).toUpperCase() + 
              username.substring(randomIndex + 1);
  }
  
  // Asegurar al menos un número (ya incluido en las variaciones)
  
  // Limitar longitud entre 8-15 caracteres
  if (username.length > 15) {
    username = username.substring(0, 15);
  }
  if (username.length < 8) {
    username += faker.string.alphanumeric(8 - username.length);
  }
  
  return username;
}

const generateFakeUsers = async (count = 10) => {
  console.log(generarCedulaVenezolana());
  const users = [];
  const defaultPassword = await hashPassword('upel1234');

  // Usuarios normales
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      ci: generarCedulaVenezolana(),
      username: generarUsernameConReglas(firstName, lastName),
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.phone.number('04##%%%%%%').replace(/\D/g, ''),
      user_type_id: faker.helpers.arrayElement([1, 2]),
      is_active: true,
      password: defaultPassword
    });
  }

  // Usuario admin
  users.push({
    ci: '311574308',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'UPEL',
    email: 'admin@upel.edu.ve',
    phone: '584121878875',
    user_type_id: 3,
    is_active: true,
    password: await hashPassword('AdminUPEL2025!')
  });

  // Usuario estudent
  users.push({
    ci: '10102030',
    username: 'student',
    first_name: 'Student',
    last_name: 'UPEL',
    email: 'student@upel.edu.ve',
    phone: '584121878834',
    user_type_id: 1,
    is_active: true,
    password: await hashPassword('StudentUPEL2025!')
  });

  // Usuario Professor
  users.push({
    ci: '11111111',
    username: 'professor',
    first_name: 'Professor',
    last_name: 'UPEL',
    email: 'professor@upel.edu.ve',
    phone: '584121878837',
    user_type_id: 2,
    is_active: true,
    password: await hashPassword('ProfessorUPEL2025!')
  });



  return users;
};

async function seedUsers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fakeUsers = await generateFakeUsers();
    for (const user of fakeUsers) {
      await client.query(`
        INSERT INTO upel_library.users (
          ci, username, first_name, last_name, email, phone, user_type_id, is_active, password
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING`,
        [
          user.ci,
          user.username,
          user.first_name, 
          user.last_name, 
          user.email,
          user.phone, 
          user.user_type_id, 
          user.is_active, 
          user.password
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Semilla completada: ${fakeUsers.length} usuarios creados`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en la semilla:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();