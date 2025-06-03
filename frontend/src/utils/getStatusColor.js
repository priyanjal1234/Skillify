function getStatusColor(status) {   
    switch(status) {
        case "Published":
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case "Draft":
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        case "Review":
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        default: 
            return 'bg-gray-100 text-gray-800'

    }
}

export default getStatusColor