import os, time, argparse, mlflow
from mlflow.tracking import MlflowClient

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run-id", required=True, help="MLflow run_id containing model/ artifact")
    ap.add_argument("--model-name", default="mg-seq-risk", help="Registered Model name")
    ap.add_argument("--stage", default="Production", help="Stage to set: Staging|Production|Archived|None")
    ap.add_argument("--description", default="MindGuard sequence risk model (TFJS)", help="Model description")
    args = ap.parse_args()

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000"))
    client = MlflowClient()

    try:
        client.get_registered_model(args.model_name)
    except Exception:
        client.create_registered_model(args.model_name)
        client.update_registered_model(name=args.model_name, description=args.description)

    source_uri = f"runs:/{args.run_id}/model"
    mv = mlflow.register_model(model_uri=source_uri, name=args.model_name)

    while True:
        mv = client.get_model_version(name=args.model_name, version=mv.version)
        if mv.status == "READY":
            break
        time.sleep(1)

    client.transition_model_version_stage(
        name=args.model_name,
        version=mv.version,
        stage=args.stage,
        archive_existing_versions=True,
    )

    client.set_model_version_tag(args.model_name, mv.version, "flavor", "tfjs")
    client.set_model_version_tag(args.model_name, mv.version, "horizon_days", "2")
    client.set_model_version_tag(args.model_name, mv.version, "lookback_days", "7")

    print(f"✅ Registered {args.model_name} v{mv.version} and moved to {args.stage}")

if __name__ == "__main__":
    main()
