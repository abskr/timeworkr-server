import SheetSchema from '../../models/Tester.js'

export const createSheet = async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.body;
  try {
    const sheetExisted = await SheetModel.findOne({ userId, month, year });
    if (sheetExisted) {
      return res.status(400).json({
        error: 'Sheet for this month is already existed!',
      });
    }
    let newSheet = new SheetModel({ userId, month, year });
    const sheet = newSheet.save();
    res.json({
      message: `sheet ${sheet._id} created!`,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};