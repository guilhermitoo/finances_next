module.exports = {
    getMonthName(month) {
        var names = [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro"
                    ];

        return names[month];
    },

    async getNextMonth(date,index) {
        if (index===0) {
            return date;
        }
        else {
            let dt = new Date(date);      
            
            let month = ((dt.getMonth()+index) % 12);
            let y = Math.trunc((dt.getMonth()+index)/12);
            let year = dt.getFullYear()+y;
            let day = dt.getDate();

            if (day == 31) {
                let dt_ud = new Date(year,month+1,0); // dia 0 trás o último dia do mês
                day = dt_ud.getDate();
            } else if ((month === 1) && (day>28)) {
                day = 28;
            }            

            let c_date = new Date(year, month, day);

            return c_date;
        }
    }
}