export const validateEmail = (email) => {
    /**
     * Validates email addresses
     * 
     * @param String email to check
     * 
     * @returns True/False
     */

    //eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const formatDateToMonthAndYear = (date) => {
    /**
     * Formats a date to display only its month and year
     * 
     * @param date date you will like to format
     * 
     * @returns string containing formatted date. Sample output: 01/23 
     * 
     */

    const validDate = new Date(date);

    if (validDate == "Invalid Date" ) return "00/00";

    return `${validDate.getMonth() < 10 ? '0' + validDate.getMonth() : validDate.getMonth()}/${String(validDate.getFullYear()).slice(2)}`
}


export const formatDate = (date) => {
    /**
     * Formats date to display year, month and day
     * 
     * @param date date you will like to format
     * 
     * @returns string containing formatted date. Sample output: 01/01/2023 
     * 
     */

    const validDate = new Date(date);

    if (validDate == "Invalid Date" ) return "0000/00/00";

    return `${validDate.getDay() < 10 ? '0' + validDate.getDay() : validDate.getDay()}.${validDate.getMonth() < 10 ? '0' + validDate.getMonth() : validDate.getMonth()}.${validDate.getFullYear()}`
}

export const formatDateToMonthAndDay = (date) => {
    /**
     * Formats a date to display only its month and day
     * 
     * @param date date you will like to format
     * 
     * @returns string containing formatted date. Sample output: Aug 23 
     * 
     */

    const validDate = new Date(date);

    if (validDate == "Invalid Date" ) return "Jan 01";

    return `${validDate.toLocaleString('en-us', { month: 'short' })} ${validDate.getDate()}`
}