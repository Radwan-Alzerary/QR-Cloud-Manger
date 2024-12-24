const router = require("express").Router();
const User = require("../models/user");
const isfulladmin = require("../config/auth").isfulladmin;
const isCashire = require("../config/auth").isCashire;
const ensureAuthenticated = require("../config/auth").userlogin;
const Visit = require("../models/visiter");

router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("dashboard" );
});
// GET /admin/approve -> Show unapproved visitors
router.get("/admin/approve", async (req, res) => {
  try {
    // Find all visitors where approved = false
    const unapprovedVisits = await Visit.find({ approved: false });
    // Render a page that lists all unapproved visitors
    res.render("admin/approve", { unapprovedVisits });
  } catch (error) {
    console.error("Error in GET /admin/approve:", error);
    res.status(500).send("Server Error");
  }
});
// routes/admin.js

// GET /admin/approve/:id/doapprove -> Approve a visitor
router.post("/admin/approve/:id/doapprove", async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).send("Visit not found");
    }

    // Approve the visitor
    visit.approved = true;
    await visit.save();

    // Redirect back to the unapproved visitors page
    res.redirect("/admin/approve");
  } catch (error) {
    console.error("Error in GET /admin/approve/:id/doapprove:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/visitor", async (req, res) => {
  const visits = await Visit.find({registered:true,coming:true}).sort({ enterprise: 1 });
  res.render("visitorList",{visits} );
});
const cloudRouter = require("./cloud");
router.use("/cloud", cloudRouter);



module.exports = router;
