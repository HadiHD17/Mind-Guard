import os, argparse, json, uuid, datetime, mlflow

def write_mlmodel():
    tmpl = """\
artifact_path: model
flavors:
  tensorflowjs:
    tfjs_version: "4.x"
mlflow_version: 2.14.0
model_uuid: {uuid}
utc_time_created: {utc}
"""
    return tmpl.format(
        uuid=str(uuid.uuid4()),
        utc=datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
    )

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--experiment", required=True)
    p.add_argument("--run_id", required=False)
    p.add_argument("--params", default="{}")
    p.add_argument("--metrics", default="{}")
    p.add_argument("--artifacts_dir", default=None)
    args = p.parse_args()

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
    mlflow.set_experiment(args.experiment)

    run = mlflow.start_run(run_id=args.run_id) if args.run_id else mlflow.start_run()
    run_id = run.info.run_id

    for k, v in json.loads(args.params).items():
        mlflow.log_param(k, v)

    for k, v in json.loads(args.metrics).items():
        mlflow.log_metric(k, float(v))

    if args.artifacts_dir and os.path.isdir(args.artifacts_dir):
        mlflow.log_artifacts(args.artifacts_dir, artifact_path="model")
        mlflow.log_text(write_mlmodel(), artifact_file="model/MLmodel")

    mlflow.end_run()
    print(run_id)

if __name__ == "__main__":
    main()
