import moment from 'moment'

function convertToRealDate(createdAt) {
    return moment(createdAt).format("MMMM Do YYYY")
}

export default convertToRealDate