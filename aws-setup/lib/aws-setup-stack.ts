import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsSetupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = new cdk.aws_secretsmanager.Secret(this, "some-secret", {
      secretName: "some-secret-value",
    });
    new cdk.aws_codebuild.Project(this, "Github", {
      projectName: "github-runner",
      source: cdk.aws_codebuild.Source.gitHub({
        owner: "RaphaelManke",
        repo: "codebuild-github-example",
        webhook: true,
        webhookFilters: [
          cdk.aws_codebuild.FilterGroup.inEventOf(
            // @ts-ignore
            "WORKFLOW_JOB_QUEUED"
          ),
        ],
      }),
      environment: {
        computeType: cdk.aws_codebuild.ComputeType.SMALL,
        buildImage: cdk.aws_codebuild.LinuxBuildImage.STANDARD_7_0,
      },
      environmentVariables: {
        CUSTOM_SECRET: {
          type: cdk.aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
          value: "some-secret-value",
        },
      },
    });
  }
}
