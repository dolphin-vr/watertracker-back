export const todayISO = (date) => {
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`
}

export const dateISO = (date)=>{
	return date.slice(0, 10)
}

export const timeISO = (date)=>{
	return date.slice(11, 16)
}

export const joinDate = (date, time)=>{
	return `${date}T${time}`
}