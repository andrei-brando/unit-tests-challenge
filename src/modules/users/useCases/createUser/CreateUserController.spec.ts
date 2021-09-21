import request from "supertest";
import { app } from "app";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import "./../../../../database";
