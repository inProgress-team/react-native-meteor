/* global Accounts */

export function createUsers() {
  console.log('Creating fake users');
  ['User'].forEach(function(name) {
    Accounts.createUser({
      username: name,
      password: 'password',
      profile: {},
    });
  });
}
