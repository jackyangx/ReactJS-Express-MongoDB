const config = {
  development: {
    dbConn: 'mongodb://COMP3006:COMP30061234@107.167.181.223/COMP3006',
    jwtKey: 'node_project_manager',
  },
  production: {
    dbConn: 'mongodb://COMP3006:COMP30061234@107.167.181.223/COMP3006',
    jwtKey: 'node_project_manager',
  },
  test: {
    dbConn: 'mongodb://COMP3006:COMP30061234@107.167.181.223/COMP3006',
    jwtKey: 'node_project_manager',
  },
};

export default config[process.env.NODE_ENV || 'development'];
