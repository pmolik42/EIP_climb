const expect = require('chai').expect;
const request = require('request');

const mongoose = require('mongoose');

const config = require('../config/config.js');

var headers = {
  'x-access-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6eyJsb2NhbCI6eyJlbWFpbCI6InRlc3RAY2xpbWIuY29tIiwicGFzc3dvcmQiOiIkMmEkMDgkRVhsQ0wzbzNQMVRLejlxYlI0MEZJT3JGZ0pvZkNRdmdlQWV4RWh0R3BQTWVVakUuckJDZDYifX0sIndhc1BvcHVsYXRlZCI6ZmFsc2UsInNjb3BlIjp7Il9pZCI6IjU4ZjljOTZjM2ExYjAxYzkzNTc3Y2JiYiIsInVwZGF0ZWRBdCI6IjIwMTctMDQtMjFUMDg6NTc6MTYuOTU2WiIsImNyZWF0ZWRBdCI6IjIwMTctMDQtMjFUMDg6NTc6MTYuOTU2WiIsIl9fdiI6MCwicHJvZmlsZSI6eyJ2ZXJpZmllZCI6dHJ1ZSwiZ2VuZGVyIjoiZmVtYWxlIiwiYmlvIjoiSGlwIEhvcCBEYW5jZXIgZnJvbSBQYXJpcyDinIzvuI8iLCJwaWN0dXJlVXJsIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2ltYWdlcy9qYW5lX2RvZS5qcGVnIiwibGFzdE5hbWUiOiJEb2UiLCJmaXJzdE5hbWUiOiJKYW5lIiwidXNlcm5hbWUiOiJ0ZXN0In0sImxvY2FsIjp7InBhc3N3b3JkIjoiJDJhJDA4JEVYbENMM28zUDFUS3o5cWJSNDBGSU9yRmdKb2ZDUXZnZUFleEVodEdwUE1lVWpFLnJCQ2Q2IiwiZW1haWwiOiJ0ZXN0QGNsaW1iLmNvbSJ9fSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicHJvZmlsZS51c2VybmFtZSI6ImluaXQiLCJsb2NhbC5wYXNzd29yZCI6ImluaXQiLCJsb2NhbC5lbWFpbCI6ImluaXQiLCJfX3YiOiJpbml0IiwicHJvZmlsZS5maXJzdE5hbWUiOiJpbml0IiwicHJvZmlsZS5sYXN0TmFtZSI6ImluaXQiLCJwcm9maWxlLnBpY3R1cmVVcmwiOiJpbml0IiwicHJvZmlsZS5iaW8iOiJpbml0IiwicHJvZmlsZS5nZW5kZXIiOiJpbml0IiwicHJvZmlsZS52ZXJpZmllZCI6ImluaXQiLCJjcmVhdGVkQXQiOiJpbml0IiwidXBkYXRlZEF0IjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwibG9jYWwuZW1haWwiOnRydWUsImxvY2FsLnBhc3N3b3JkIjp0cnVlLCJwcm9maWxlLnVzZXJuYW1lIjp0cnVlLCJwcm9maWxlLmZpcnN0TmFtZSI6dHJ1ZSwicHJvZmlsZS5sYXN0TmFtZSI6dHJ1ZSwicHJvZmlsZS5waWN0dXJlVXJsIjp0cnVlLCJwcm9maWxlLmJpbyI6dHJ1ZSwicHJvZmlsZS5nZW5kZXIiOnRydWUsInByb2ZpbGUudmVyaWZpZWQiOnRydWUsImNyZWF0ZWRBdCI6dHJ1ZSwidXBkYXRlZEF0Ijp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsibG9jYWwiOnsiZW1haWwiOiJ0ZXN0QGNsaW1iLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JEVYbENMM28zUDFUS3o5cWJSNDBGSU9yRmdKb2ZDUXZnZUFleEVodEdwUE1lVWpFLnJCQ2Q2In0sImZhY2Vib29rIjp7fSwicHJvZmlsZSI6eyJ1c2VybmFtZSI6InRlc3QiLCJmaXJzdE5hbWUiOiJKYW5lIiwibGFzdE5hbWUiOiJEb2UiLCJwaWN0dXJlVXJsIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2ltYWdlcy9qYW5lX2RvZS5qcGVnIiwiYmlvIjoiSGlwIEhvcCBEYW5jZXIgZnJvbSBQYXJpcyDinIzvuI8iLCJnZW5kZXIiOiJmZW1hbGUiLCJ2ZXJpZmllZCI6dHJ1ZX0sIl9fdiI6MCwiY3JlYXRlZEF0IjoiMjAxNy0wNC0yMVQwODo1NzoxNi45NTZaIiwidXBkYXRlZEF0IjoiMjAxNy0wNC0yMVQwODo1NzoxNi45NTZaIiwiX2lkIjoiNThmOWM5NmMzYTFiMDFjOTM1NzdjYmJiIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdfSwiaWF0IjoxNDk0NTEyNTYxLCJleHAiOjE0OTUxMTczNjF9.eNFkrg-yOTsA2zmQBoqpt9ioL9f7DJSRx1Eodu_buuQ"
};

var baseUrl = "http://localhost:8080/api/profile/";

describe('/GET profile/test', () => {
      it('it should GET test profile', (done) => {
        request.get({url: baseUrl + 'test', headers: headers}, (err, httpResponse, body) => {
              expect(JSON.parse(body).success).to.equal(true);
              done();
            });
      });
  });

  describe('/GET profile/doesntexist', () => {
        it('it should return user not found', (done) => {
          request.get({url: baseUrl + 'doesntexist', headers: headers}, (err, httpResponse, body) => {
                expect(JSON.parse(body).message).to.equal('User not found');
                done();
              });
        });
    });
