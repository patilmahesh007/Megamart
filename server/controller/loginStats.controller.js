import User from '../models/auth.model.js';
import moment from 'moment';

export const getLoginStats = async (req, res) => {
  try {
    const range = req.query.range || "month";
    let startDate;

    if (range === "day") {
      startDate = moment().startOf('day').toDate();
    } else if (range === "week") {
      startDate = moment().startOf('week').toDate();
    } else if (range === "month") {
      startDate = moment().startOf('month').toDate();
    } else {
      startDate = new Date(0);
    }

    const loginStats = await User.aggregate([
      {
        $match: { 
          lastLogin: { 
            $gte: startDate,  
            $ne: null         
          } 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    const labels = loginStats.map(stat => stat._id);
    const counts = loginStats.map(stat => stat.count);

    return res.json({ data: { labels, counts } });
  } catch (error) {
    console.error("Error fetching login stats:", error);
    return res.status(500).json({ error: "Failed to fetch login stats" });
  }
};

