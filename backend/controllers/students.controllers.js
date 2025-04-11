const Student = require('../models/student.models');
const axios = require('axios');

const fetchAndStoreStudents = async (req, res) => {
  try {
    // fetchign data from external API
    const response = await axios.get('https://67ebf57baa794fb3222c4652.mockapi.io/eraah/students');
    const students = response.data;

    // lastupdated
    const storedStudents = await Student.insertMany(
      students.map(student => ({
        ...student,
        lastUpdated: new Date()
      }))
    );

    res.status(200).json(storedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
    try {
      const { sort, active, course, age, id, order = 'asc' } = req.query;
      
      // If ID is provided, return single student
      if (id) {
        const student = await Student.findById(id);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        return res.status(200).json(student);
      }

      let query = Student.find();
      // Filter by active status
      if (active !== undefined) {
        query = query.where('active').equals(active === 'true');
      }
      // Filter by course
      if (course) {
        query = query.where('Course').equals(course);
      }
      // Filter by age (less than or equal to)
      if (age) {
        query = query.where('age').lte(parseInt(age));
      }
      // Enhanced sorting with order direction
      if (sort) {
        const sortOrder = order === 'desc' ? '-' : '';
        switch (sort) {
          case 'name':
            query = query.sort(`${sortOrder}name`);
            break;
          case 'course':
            query = query.sort(`${sortOrder}Course`);
            break;
          case 'age':
            query = query.sort(`${sortOrder}age`);
            break;
          default:
            break;
        }
      }
  
      const students = await query.exec();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = {
  fetchAndStoreStudents,
  getStudents
};

//  EXAMPLE USAGE OF ENDPOINTS (SINCE I AM NOT SHARING ANY POSTMAN)
// # Get all students sorted by name in descending order
// GET /api/students?sort=name&order=desc

// # Get active students under 21 years old
// GET /api/students?active=true&age=21

// # Get a specific student by ID
// GET /api/students?id=123

// # Get students taking Computer Science, sorted by age ascending
// GET /api/students?course=Computer Science&sort=age&order=asc