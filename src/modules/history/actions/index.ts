"use server";

import db from "@/lib/db";
import { currentUser } from "@/modules/authentication/actions";
import { HISTORY_STATUS, REST_METHOD } from "@prisma/client";

export interface CreateHistoryParams {
  workspaceId: string;
  workspaceName: string;
  collectionId?: string;
  collectionName?: string;
  requestId?: string;
  requestName: string;
  method: REST_METHOD;
  url: string;
  status?: HISTORY_STATUS;
  httpStatus?: number;
}

export async function createHistory(params: CreateHistoryParams) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch collection name if collectionId is provided but collectionName is not
  let collectionName = params.collectionName;
  if (params.collectionId && !collectionName) {
    try {
      const collection = await db.collection.findUnique({
        where: { id: params.collectionId },
        select: { name: true },
      });
      if (collection) {
        collectionName = collection.name;
      }
    } catch (e) {
      console.error("Failed to fetch collection name:", e);
    }
  }

  const history = await db.history.create({
    data: {
      userId: user.id,
      workspaceId: params.workspaceId,
      workspaceName: params.workspaceName,
      collectionId: params.collectionId,
      collectionName: collectionName,
      requestId: params.requestId,
      requestName: params.requestName,
      method: params.method,
      url: params.url,
      status: params.status || HISTORY_STATUS.PENDING,
      httpStatus: params.httpStatus,
    },
  });

  return history;
}

export async function updateHistoryStatus(
  historyId: string,
  status: HISTORY_STATUS,
  httpStatus?: number
) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const history = await db.history.update({
    where: {
      id: historyId,
      userId: user.id,
    },
    data: {
      status,
      httpStatus: httpStatus ?? null,
    },
  });

  return history;
}

export async function getUserHistory() {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const histories = await db.history.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return histories;
}

export async function getWorkspaceHistory(workspaceId: string) {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const histories = await db.history.findMany({
    where: {
      userId: user.id,
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return histories;
}

export async function deleteHistory(historyId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.history.delete({
    where: {
      id: historyId,
      userId: user.id,
    },
  });

  return { success: true };
}

export async function clearUserHistory() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.history.deleteMany({
    where: {
      userId: user.id,
    },
  });

  return { success: true };
}
