exports.formatDateAndTime = (date) => {
    /**
     * Formats a valid date string.
     * 
     * @param date The date string you will like to format.
     * 
     * @returns The formatted date string in the following format: YYYY/MM/DD.
     */

    // creating a new date instance using the string('date') passed
    const validDate = new Date(date);

    // throwing a error if 'date' passed is not an actual date
    if (validDate == 'Invalid Date') throw Error('date passed is invalid');

    // returning the date in the following format: YYYY/MM/DD
    return `${validDate.getFullYear()}/${validDate.getMonth() + 1 < 10 ? '0' : ''}${validDate.getMonth() + 1}/${validDate.getDate() < 10 ? '0' : ''}${validDate.getDate()}`;
}