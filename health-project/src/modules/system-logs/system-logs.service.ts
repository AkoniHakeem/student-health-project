import OpenAI from "openai";
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SymptomLog } from "../../entities/symptom-log.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "../../entities/user.entity";
import { CreateSymptomLogDto } from "./dtos/CreateSymptomLog.dto";

@Injectable()
export class SymptomLogsService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(SymptomLog)
    private readonly repo: Repository<SymptomLog>,
    private readonly config: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>("OPENAI_API_KEY"),
    });
  }

  private async analyzeSymptoms(input: string): Promise<string> {
    const resp = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-3.5-turbo as a fallback
      messages: [
        {
          role: "user",
          content: `I have these symptoms: ${input}. Briefly diagnose and advise.`,
        },
      ],
      temperature: 0.7,
    });
    return resp.choices?.[0].message?.content.trim() ?? "";
  }

  /**
   * Student creates a symptom-log entry: calls AI, stores input & response.
   */
  async createLog(
    student: User,
    dto: CreateSymptomLogDto
  ): Promise<SymptomLog> {
    if (student.role !== "student") {
      throw new ForbiddenException("Only students can submit symptom logs");
    }
    let aiResponse: string;
    try {
      aiResponse = await this.analyzeSymptoms(dto.input);
    } catch {
      const commonResponses = [
      "Please consult a healthcare professional for a detailed diagnosis.",
      "I'm sorry, I couldn't analyze your symptoms at the moment.",
      "Ensure you get plenty of rest and stay hydrated.",
      "Consider visiting a clinic if symptoms persist or worsen.",
      ];
      aiResponse = commonResponses[Math.floor(Math.random() * commonResponses.length)];
    }

    const entry = this.repo.create({
      student,
      input: dto.input,
      aiResponse,
    });
    return this.repo.save(entry);
  }

  /** A student fetches their own logs */
  async findByStudent(student: User): Promise<SymptomLog[]> {
    return this.repo.find({
      where: { student: { id: student.id } },
      order: { timestamp: "DESC" },
    });
  }

  /** Clinic staff & admin fetch any student’s logs */
  async findForStudent(studentId: number): Promise<SymptomLog[]> {
    return this.repo.find({
      where: { student: { id: studentId } },
      order: { timestamp: "DESC" },
    });
  }

  /** Fetch a single entry (with access control) */
  async findOne(id: number, requester: User): Promise<SymptomLog> {
    const log = await this.repo.findOne({
      where: { id },
      relations: ["student"],
    });
    if (!log) throw new NotFoundException("Symptom log not found");

    if (requester.role === "student" && log.student.id !== requester.id) {
      throw new ForbiddenException();
    }
    return log;
  }
}
