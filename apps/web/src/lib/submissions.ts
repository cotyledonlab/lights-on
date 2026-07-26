import { database } from "@lights-on/database";
import { jobQueue } from "@lights-on/queue";

export async function createQueuedReceiptSubmission(
  participantId: string,
  rawText: string
) {
  return database.$transaction(async (transaction) => {
    const submission = await transaction.submission.create({
      data: { participantId, rawText }
    });
    await jobQueue.enqueue(
      "receipt.extract",
      submission.id,
      { submissionId: submission.id },
      { submissionId: submission.id, transaction }
    );
    return submission;
  });
}

export async function deleteParticipantData(participantId: string): Promise<void> {
  await database.participant.deleteMany({ where: { id: participantId } });
}
