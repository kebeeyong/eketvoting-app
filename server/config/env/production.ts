const config = {
//  db : 'mongodb://user:123123123@ds161487.mlab.com:61487/voting-app26',
//  sessionSecret: process.env.SESSION_SECRET || 'prodsecretkey'
  // db: 'mongodb://user:123123123@ds161487.mlab.com:61487/voting-app26',
  	 db: 'mongodb://<dbuser>:<dbpassword>@ds149124.mlab.com:49124/eketvoting-app',
   // sessionSecret: process.env.SESSION_SECRET || 'prodsecretkey'
   sessionSecret: process.env.SESSION_SECRET || 'Lakers23'
};
};

export default config;
