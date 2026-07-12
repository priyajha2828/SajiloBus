import  express from "express";
import  { getBuses, getBusById,createBus,updateBus,deleteBus,getBusCount,} from "../controllers/busController.js";

<<<<<<< HEAD
const router = express.Router();

const {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusCount,
   getLiveBusLocations,
} = require("../controllers/busController");
=======
export const router = express.Router();
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915

// Count
router.get("/count", getBusCount);

// Get All
router.get("/", getBuses);



// Create
router.post("/", createBus);

// Update
router.put("/:id", updateBus);

// Delete
router.delete("/:id", deleteBus);

<<<<<<< HEAD
router.get("/:id", getBusById);

module.exports = router;
=======
// export default router;
>>>>>>> 20c3ca8643a1b4b50975f40c9f1c67be8a464915
