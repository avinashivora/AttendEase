const Issue = require("./../models/issueSchema");

exports.createIssue = async (req, res) => {
  try {
    const newIssue = await Issue.create({
      subject: req.body.subject,
      description: req.body.description,
      email: req.body.email,
    });

    if (newIssue) {
      return res.json({
        success: true,
        message: "issue created",
        data: newIssue,
      });
    } else {
      return res.json({
        success: false,
        message: "Failed to create issue",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json({
      success: true,
      message: "Issues fetched",
      issues,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      err,
    });
  }
};
