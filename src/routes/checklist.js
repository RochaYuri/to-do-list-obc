const express = require("express");

const router = express.Router();

const Checklist = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    let checklists = await Checklist.find({}).populate("tasks");
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (err) {
    res.status(500).render("pages/error", { err: "Erro ao exibir as listas" });
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (err) {
    res
      .status(500)
      .render("pages/error", { err: "Erro ao carregar o formulário" });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (err) {
    res.status(500).render("pages/error", {
      err: "Erro ao exibir a edição de lista de taferas",
    });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new Checklist({ name });

  try {
    await checklist.save();
    res.redirect("/checklists");
  } catch (err) {
    res
      .status(422)
      .render("checklists/new", { checklist: { ...checklist, err } });
  }
});

// Rota dinamica
router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id).populate("tasks");
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (err) {
    res
      .status(500)
      .render("pages/error", { err: "Erro ao exibir o checklist" });
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await Checklist.findById(req.params.id);

  try {
    await checklist.updateOne({ name });
    res.redirect("/checklists");
  } catch (err) {
    let errors = err.errors;
    console.log(err);
    res
      .status(422)
      .render("checklists/edit", { checklist: { ...checklist, errors } });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findByIdAndDelete(req.params.id);
    res.redirect("/checklists");
  } catch (err) {
    res
      .status(500)
      .render("pages/error", { err: "Erro ao deletar a lista de tarefa" });
  }
});

module.exports = router;
