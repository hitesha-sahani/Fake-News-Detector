import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import * as path from "path"

export async function POST(request: NextRequest) {
  try {
    return new Promise((resolve) => {
      // Run the Python training script
      const pythonProcess = spawn("python", [path.join(process.cwd(), "scripts", "train_model.py")])

      let output = ""
      let errorOutput = ""

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString()
        console.log("[v0]", data.toString())
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
        console.error("[v0]", data.toString())
      })

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(
            NextResponse.json(
              {
                status: "success",
                message: "Model training completed successfully",
                output,
              },
              { status: 200 },
            ),
          )
        } else {
          resolve(
            NextResponse.json(
              {
                status: "error",
                message: "Model training failed",
                error: errorOutput,
              },
              { status: 500 },
            ),
          )
        }
      })
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to start training",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
