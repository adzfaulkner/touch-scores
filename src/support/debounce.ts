let timeout: ReturnType<typeof setTimeout>

const debounce = (func: Function, wait: number): Function => {
    return (...args: any) => {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export {
    debounce
}