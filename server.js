const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const auditRoutes = express.Router();
const PORT = 4000;

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const CONNECTION_URL = 'mongodb+srv://fyp_user:3DUySyLyPGRUSmRo@fypcluster-9zbg3.mongodb.net/finalYearProject?retryWrites=true';

let Audit = require('./audit.model');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 10000 }));

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true });
const connection = mongoose.connection;

let connectionToMongoDB = false;

connection.once('open', () => {
  console.log('Connection to MongoDB database established!')
  connectionToMongoDB = true;
});

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

auditRoutes.route('/check-connection').post((req, res) => {
  res.send(connectionToMongoDB);
});

//Email and password are removed for github
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: '*******',
//     pass: '*******'
//   }
// });

// transporter.verify((err, success) => {
//   if (err) {
//     console.log(error);
//   } else {
//     console.log('Server is ready for email!');
//   }
// })

//Send Email
auditRoutes.route('/send-email').post((req, res) => {
  let content = `Name: ${req.body.name}\n Email: ${req.body.email}\n Message: ${req.body.message}`;

  var email = {
    from: req.body.name,
    to: 'w1616792@gmail.com',
    subject: req.body.subject + ' From ' + req.body.email,
    text: content
  }

  transporter.sendMail(email, (err, data) => {
    if (err) {
      res.json({ 
        msg: 'Failed to send mail!',
        status: 'failed'
      })
    } else {
      res.json({ 
        msg: 'Email sent succesfully',
        status: 'success'
      })
    }
  })
});

//Find all the audits by user ID
auditRoutes.route('/find').post((req, res) => {
  if (req.body.id !== null) {
    Audit.find({ auditUser: req.body.id }, (err, docs) => {
      if (docs !== null) {
        if (docs.length === 0){
          docs = [ 'empty' ];
        }
        res.json(docs);
      } else if (err !== null) {
        res.json(err)
      }
    })
  } else {
    res.status(500).json({ error: 'User ID invalid.'})
  }
});

//Find audit data by audit id
auditRoutes.route('/:id').get((req, res) => {
  Audit.findById(req.params.id, (err, audit) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(audit);
    }
  });
});

//Remove audit from database
auditRoutes.route('/delete').post((req, res) => {
  Audit.findOneAndDelete({ _id: req.body.id }, err => {
    if (err) {
      return res.status(500).send(err)
    } else {
      return res.status(200).json({ auditDeleted: true })
    }
  })
})

//Add audit to mongodb collection 
auditRoutes.route('/add-audit').post((req, res) => {
  let audit = new Audit(req.body);
  audit.save((err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).json({ auditAdded: true })
    }
  })
});

//Run lighthouse test
auditRoutes.route('/runtest').post((req, res) => {
  if(!req.body.device) {
    req.body.device = 'desktop'
  }
  let AUDIT_URL = req.body.url;
  let CATEGORIES = req.body.onlyCategories;
  let DEVICE = req.body.device;

  const opts = {
    chromeFlags: [
      '--show-paint-rects',
      '--headless',
    ],
    onlyCategories: CATEGORIES,
    skipAudits: [
      'critical-request-chains'
    ],
    emulatedFormFactor: DEVICE
  };

  function launchChromeAndRunLighthouse(url, opts, config = null) {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        return chrome.kill().then(() => results.lhr)
      });
    });
  }
  
  // Usage:
  launchChromeAndRunLighthouse(AUDIT_URL, opts)
    .then(results => {
      res.send(results)
    })
    .catch(error => {
      res.send(error)
    });

})

app.use('/audits', auditRoutes);

app.listen(PORT, function() {
  console.log('Server is running on port: ' + PORT);
});