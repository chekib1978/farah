class AppointmentSystem {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.appointments = this.loadAppointments();
        
        // Éléments du DOM
        this.monthYear = document.getElementById('month-year');
        this.calendarDays = document.getElementById('calendar-days');
        this.timeSelection = document.getElementById('time-selection');
        this.timeSlots = document.getElementById('time-slots');
        this.appointmentForm = document.getElementById('appointment-form');
        this.selectedDateSpan = document.getElementById('selected-date');
        this.selectedTimeSpan = document.getElementById('selected-time');
        this.confirmationDiv = document.getElementById('appointment-confirmation');
        
        // Boutons de navigation
        document.getElementById('prev-month').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.navigateMonth(1));
        
        // Formulaire
        this.appointmentForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Initialisation
        this.renderCalendar();
    }
    
    loadAppointments() {
        const saved = localStorage.getItem('appointments');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveAppointments() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }
    
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    navigateMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Afficher le mois et l'année
        this.monthYear.textContent = new Date(year, month, 1)
            .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        // Vider le calendrier
        this.calendarDays.innerHTML = '';
        
        // Premier jour du mois
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Jours du mois précédent
        const startPadding = firstDay.getDay();
        for (let i = 0; i < startPadding; i++) {
            this.createDayElement('');
        }
        
        // Jours du mois actuel
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            
            const dayElement = this.createDayElement(day);
            
            if (isWeekend || isPast) {
                dayElement.classList.add('unavailable');
            } else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => this.selectDate(date));
            }
        }
    }
    
    createDayElement(content) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = content;
        if (!content) day.classList.add('empty');
        this.calendarDays.appendChild(day);
        return day;
    }
    
    selectDate(date) {
        this.selectedDate = date;
        this.selectedDateSpan.textContent = this.formatDate(date);
        this.renderTimeSlots();
        this.timeSelection.style.display = 'block';
        this.appointmentForm.style.display = 'none';
    }
    
    isTimeSlotAvailable(date, time) {
        const dateKey = date.toISOString().split('T')[0];
        const bookedTimes = this.appointments[dateKey] || [];
        return !bookedTimes.includes(time);
    }
    
    renderTimeSlots() {
        this.timeSlots.innerHTML = '';
        const dateKey = this.selectedDate.toISOString().split('T')[0];
        const bookedTimes = this.appointments[dateKey] || [];
        
        // Créneaux de 9h à 17h
        for (let hour = 9; hour < 17; hour++) {
            for (let minutes of ['00', '30']) {
                const timeString = `${hour}:${minutes}`;
                const isAvailable = this.isTimeSlotAvailable(this.selectedDate, timeString);
                
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                if (!isAvailable) {
                    slot.classList.add('unavailable');
                    slot.innerHTML = `
                        <span>${timeString}</span>
                        <span class="slot-status">Indisponible</span>
                    `;
                } else {
                    slot.addEventListener('click', () => this.selectTime(timeString));
                    slot.innerHTML = `
                        <span>${timeString}</span>
                        <span class="slot-status">Disponible</span>
                    `;
                }
                this.timeSlots.appendChild(slot);
            }
        }
    }
    
    selectTime(time) {
        if (!this.isTimeSlotAvailable(this.selectedDate, time)) {
            alert('Ce créneau n\'est plus disponible. Veuillez en choisir un autre.');
            return;
        }
        
        this.selectedTime = time;
        this.selectedTimeSpan.textContent = time;
        this.appointmentForm.style.display = 'block';
        
        // Faire défiler jusqu'au formulaire
        this.appointmentForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const dateKey = this.selectedDate.toISOString().split('T')[0];
        if (!this.isTimeSlotAvailable(this.selectedDate, this.selectedTime)) {
            alert('Ce créneau n\'est plus disponible. Veuillez choisir un autre créneau.');
            this.timeSelection.style.display = 'block';
            this.appointmentForm.style.display = 'none';
            this.renderTimeSlots();
            return;
        }
        
        if (!this.appointments[dateKey]) {
            this.appointments[dateKey] = [];
        }
        
        // Ajouter le rendez-vous
        this.appointments[dateKey].push(this.selectedTime);
        this.saveAppointments();
        
        // Récupérer les informations du formulaire
        const formData = {
            name: document.getElementById('patient-name').value,
            email: document.getElementById('patient-email').value,
            phone: document.getElementById('patient-phone').value,
            reason: document.getElementById('appointment-reason').value,
            date: this.formatDate(this.selectedDate),
            time: this.selectedTime
        };
        
        // Envoyer l'email de confirmation
        this.sendConfirmationEmail(formData);
        
        // Afficher la confirmation
        this.showConfirmation(formData);
        
        // Réinitialiser le formulaire
        this.appointmentForm.reset();
        this.appointmentForm.style.display = 'none';
        this.timeSelection.style.display = 'none';
        
        // Mettre à jour le calendrier
        this.renderCalendar();
    }
    
    async sendConfirmationEmail(formData) {
        try {
            const templateParams = {
                to_name: formData.name,
                to_email: formData.email,
                date: formData.date,
                time: formData.time,
                reason: formData.reason,
                phone: formData.phone
            };

            await emailjs.send(
                'service_p5zun6o', // Remplacez par votre Service ID d'EmailJS
                'template_d7fahwh', // Remplacez par votre Template ID d'EmailJS
                templateParams,
                'OIfYyuOPH1tfpL0oB' // Remplacez par votre Public Key d'EmailJS
            );
            
            console.log('Email de confirmation envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            // Vous pouvez ajouter ici une notification à l'utilisateur en cas d'erreur
        }
    }
    
    showConfirmation(data) {
        this.confirmationDiv.style.display = 'block';
        this.confirmationDiv.innerHTML = `
            <h3>Rendez-vous confirmé !</h3>
            <p><strong>Patient :</strong> ${data.name}</p>
            <p><strong>Date :</strong> ${data.date}</p>
            <p><strong>Heure :</strong> ${data.time}</p>
            <p><strong>Motif :</strong> ${data.reason}</p>
            <p>Un email de confirmation a été envoyé à ${data.email}</p>
            <p>Nous vous contacterons au ${data.phone} en cas de besoin.</p>
            <button onclick="window.location.reload()" class="cta-button">Nouveau rendez-vous</button>
        `;
        
        // Faire défiler jusqu'à la confirmation
        this.confirmationDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialiser le système de rendez-vous
document.addEventListener('DOMContentLoaded', () => {
    new AppointmentSystem();
}); 