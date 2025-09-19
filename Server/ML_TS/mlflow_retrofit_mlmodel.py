import os, argparse, uuid, datetime, mlflow

TMP_FLAVOR_NAME = "tensorflowjs"   

TEMPLATE = """\
artifact_path: model
flavors:
  {flavor}:
    tfjs_version: "4.x"
mlflow_version: 2.14.0
model_uuid: {uuid}
utc_time_created: {utc}
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run-id", required=True)
    ap.add_argument("--flavor", default=TMP_FLAVOR_NAME)
    args = ap.parse_args()

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
    mlflow.start_run(run_id=args.run_id)

    content = TEMPLATE.format(
        flavor=args.flavor,
        uuid=str(uuid.uuid4()),
        utc=datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
    )

    mlflow.log_text(content, artifact_file="model/MLmodel")
    mlflow.end_run()

    print(f"✅ Wrote MLmodel into run {args.run_id} under model/MLmodel")

if __name__ == "__main__":
    main()
