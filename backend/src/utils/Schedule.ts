import schedule from 'node-schedule';
import ProjectService from '../services/ProjectService';

// Schedule this job to run at midnight every day
schedule.scheduleJob('0 0 * * *', async () => {
    try {
        await ProjectService.handleEndDates();
        console.log('Project end dates handled successfully.');
    } catch (error) {
        console.error('Error handling project end dates:', error);
    }
});
