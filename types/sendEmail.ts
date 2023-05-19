export interface Email extends Document {
  to : string;
  from : string;
  subject? : string;
  templateId : string;
  dynamic_template_data : object;
  text?: string;
  html?: string;
}
