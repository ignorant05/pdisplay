#!/usr/bin/env node
var si = require("systeminformation"),
  blessed = require("blessed"),
  contrib = require("blessed-contrib"),
  screen = blessed.screen(),
  cmd = require("commander");

cmd.program
  .version("1.0.0")
  .description(
    "Simple process monitor that displays only the services running on ports.\n Displays: \n- Process name.\n- PID.\n- Transmission Protocol.\n- Source ->> Destination IP addr.\n- Source ->> Destination PORT.\n- State (ESTABLISHED/WAIT)",
  );

cmd.program.parse(process.argv);

const colorize = (...args) => ({
  red: `\x1b[31m${args.join(" ")}`,
  green: `\x1b[32m${args.join(" ")}`,
  yellow: `\x1b[33m${args.join(" ")}`,
  blue: `\x1b[34m${args.join(" ")}`,
  magenta: `\x1b[35m${args.join(" ")}`,
  cyan: `\x1b[36m${args.join(" ")}`,
});

var table = contrib.table({
  keys: true,
  vi: true,
  fg: "white",
  selectedFg: "white",
  selectedBg: "blue",
  interactive: true,
  label: "Active Processes",
  width: "100%",
  height: "100%",
  align: "center",
  border: { type: "line", fg: "cyan" },
  columnSpacing: 10,
  columnWidth: [10, 10, 6, 35, 20, 10],
});

async function start() {
  while (true) {
    await updateTable();
    await new Promise((r) => setTimeout(r, 1000));
    screen.key(["escape", "q", "C-c"], function(ch, key) {
      return process.exit(0);
    });
    table.rows.on("select", (item) => {
      const cells = item
        .getText()
        .trim()
        .split(/\s{2,}/);

      process.kill(parseInt(cells.at(1)));
    });

    screen.render();
  }
}

start();

async function updateTable() {
  try {
    let info = await getServices();
    table.focus();
    screen.append(table);
    table.setData({
      headers: [
        colorize("Process").magenta,
        "PID",
        "Protocol",
        "IP: From ->> To",
        "PORT: From ->> To",
        "State",
      ],
      data: info,
    });
  } catch (error) {
    throw new Error(`Something went wrong.\nError: ${error}`);
  }
}

async function getServices() {
  let info = await si.networkConnections();

  return info
    .filter((proc) => {
      return (
        proc.state.toUpperCase() === "ESTABLISHED" ||
        proc.state.toUpperCase() === "TIME_WAIT"
      );
    })
    .map((proc) => {
      return [
        proc.process ? proc.process : colorize(" - ").red,
        proc.pid ? proc.pid.toString() : colorize(" - ").red,
        proc.protocol ? proc.protocol : colorize(" - ").red,
        colorize(proc.localAddress + " ->> " + proc.peerAddress).cyan,
        proc.localPort && proc.peerPort
          ? colorize(
            proc.localPort.toString() + " ->> " + proc.peerPort.toString(),
          ).green
          : colorize(" - ").red,
        proc.state.toUpperCase() === "ESTABLISHED"
          ? colorize(proc.state).blue
          : colorize(proc.state).red,
      ];
    });
}
