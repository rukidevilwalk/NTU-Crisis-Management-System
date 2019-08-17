/* Author(s): Neo Kee Pin */
const sms_contact = {
    "sms_contact": "SAF",
    "sms_message": "This is just for testing"
};

test('sms contact cannot be empty', () => {
    expect(sms_contact['sms_contact']).not.toBe('');
}); 

test('sms content cannot be empty', () => {
    expect(sms_contact['sms_message']).not.toBe('');
});